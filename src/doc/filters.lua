function Image(el)
  -- convert svg to pdf for latex
  if string.sub(el.src, -4) == '.svg' then
    if FORMAT:match 'latex' then
      local pdfName = string.gsub(el.src, "svg", "pdf")
      pandoc.pipe('inkscape', { el.src, '--export-filename', pdfName }, '')
      el.src = pdfName
      return el
    end
    -- convert tif to png for html and revealjs
  elseif string.sub(el.src, -4) == '.tif' then
    local pngName = string.gsub(el.src, "tif", "png")
    pandoc.pipe('inkscape', { el.src, '--export-filename', pngName }, '')
    el.src = pngName
    return el
  end
end

function Span(span)
  color = span.attributes['color']
  -- if no color attribute, return unchange
  if color == nil then return span end

  -- tranform to <span style="color: red;"></span>
  if FORMAT:match 'html' or FORMAT:match 'revealjs' then -- Also available for revealjs
    -- remove color attributes
    span.attributes['color'] = nil
    -- use style attribute instead
    span.attributes['style'] = 'color: ' .. color .. ';'
    -- return full span element
    return span
  elseif FORMAT:match 'latex' or FORMAT:match 'beamer' then -- Also available for beamer
    -- remove color attributes
    span.attributes['color'] = nil
    -- encapsulate in latex code
    if string.sub(color, 1, 1) == "#" and #color == 7 then
      -- TODO: requires xcolor
      local R = tostring(tonumber(string.sub(color, 2, 3), 16))
      local G = tostring(tonumber(string.sub(color, 4, 5), 16))
      local B = tostring(tonumber(string.sub(color, 6, 7), 16))
      table.insert(
        span.content, 1,
        pandoc.RawInline('latex', '\\textcolor[RGB]{' .. R .. ',' .. G .. ',' .. B .. '}{')
      )
    elseif string.sub(color, 1, 1) == "#" and #color == 4 then
      -- TODO: requires xcolor
      local R = tostring(tonumber(string.sub(color, 2, 2), 16) * 0x11)
      local G = tostring(tonumber(string.sub(color, 3, 3), 16) * 0x11)
      local B = tostring(tonumber(string.sub(color, 4, 4), 16) * 0x11)
      table.insert(
        span.content, 1,
        pandoc.RawInline('latex', '\\textcolor[RGB]{' .. R .. ',' .. G .. ',' .. B .. '}{')
      )
    else
      table.insert(
        span.content, 1,
        pandoc.RawInline('latex', '\\textcolor{' .. color .. '}{')
      )
    end
    table.insert(
      span.content,
      pandoc.RawInline('latex', '}')
    )
    -- returns only span content
    return span.content
  else
    -- for other format return unchanged
    return span
  end
end

-- Define the colors for each tag
local colors = {
  REVIEW = "cyan",
  REWRITE = "pink",
  TODO = "yellow"
}

-- Function to process text
function process_text(content)
  -- Check for each tag
  for tag, color in pairs(colors) do
    -- If the tag is found in the content
    if content:find('!' .. tag .. ':') then
      -- Highlight the entire content in the appropriate color
      return pandoc.RawInline('latex', '\\colorbox{' .. color .. '}{' .. content .. '}')
    end
  end

  -- If no tags were found, return nil
  return nil
end

-- Function to process each paragraph
function Para(para)
  -- Convert the paragraph to a string
  local content = pandoc.utils.stringify(para)

  -- Process the text
  local result = process_text(content)

  -- If a result was returned, replace the paragraph content with it
  if result then return pandoc.Para({ result }) end

  -- If no tags were found, return the paragraph unchanged
  return para
end

-- Function to process each bullet list item
function Plain(plain)
  -- Convert the item to a string
  local content = pandoc.utils.stringify(plain)

  -- Process the text
  local result = process_text(content)

  -- If a result was returned, replace the item content with it
  if result then return pandoc.Plain({ result }) end

  -- If no tags were found, return the item unchanged
  return plain
end
