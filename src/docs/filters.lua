function Image(el)
  -- convert svg to pdf for typst
  if string.sub(el.src, -4) == '.svg' then
    if FORMAT:match 'latex' then
      local pdfName = string.gsub(el.src, "svg", "pdf")
      if os.execute('if not exist "' .. pdfName .. '" exit 1') ~= 0 then
        pandoc.pipe('magick', { el.src, pdfName }, '')
      end
      el.src = pdfName
      return el
    end
    -- convert tif to png for html and revealjs
  elseif string.sub(el.src, -4) == '.tif' then
    local pngName = string.gsub(el.src, "tif", "png")
    if os.execute('if not exist "' .. pngName .. '" exit 1') ~= 0 then
      pandoc.pipe('magick', { el.src, pngName }, '')
    end
    el.src = pngName
    return el
  end
end

function Span(span)
  color = span.attributes['color']
  -- if no color attribute, return unchange
  if color == nil then return span end

  -- remove color attributes
  span.attributes['color'] = nil

  if FORMAT:match 'latex' or FORMAT:match 'beamer' then -- Also available for beamer
    -- encapsulate in latex code
    if string.sub(color, 1, 1) == "#" and #color == 7 then
      local R = tostring(tonumber(string.sub(color, 2, 3), 16))
      local G = tostring(tonumber(string.sub(color, 4, 5), 16))
      local B = tostring(tonumber(string.sub(color, 6, 7), 16))
      table.insert(
        span.content, 1,
        pandoc.RawInline('latex', '\\textcolor[RGB]{' .. R .. ',' .. G .. ',' .. B .. '}{')
      )
    elseif string.sub(color, 1, 1) == "#" and #color == 4 then
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
  elseif FORMAT:match 'html' or FORMAT:match 'revealjs' then -- Also available for revealjs
    -- use style attribute instead
    span.attributes['style'] = 'color: ' .. color .. ';'
    -- return full span element
    return span
  elseif FORMAT:match 'typst' then -- Also available for beamer
    -- encapsulate in typst code
    if color:match("^#?[0-9a-fA-F]+$") then
      table.insert(
        span.content, 1,
        pandoc.RawInline('typst', '#text(rgb("' .. color .. '"))[')
      )
    else
      table.insert(
        span.content, 1,
        pandoc.RawInline('typst', '#text(' .. color .. ')[')
      )
    end

    table.insert(
      span.content,
      pandoc.RawInline('typst', ']')
    )
    -- returns only span content
    return span.content
  elseif FORMAT:match 'docx' then -- For Word documents
    -- encapsulate in Word code
    table.insert(
      span.content, 1,
      pandoc.RawInline('openxml', '<w:r><w:rPr><w:color w:val="' .. color .. '"/></w:rPr><w:t>')
    )
    table.insert(
      span.content,
      pandoc.RawInline('openxml', '</w:t></w:r>')
    )
    -- return full span element
    return span.content
  else
    -- for other format return unchanged
    return span
  end
end

-- This Lua filter will highlight sentences that start with "!REWRITE", "!REVIEW", or "!TODO"

local keywords = {}
for _, keyword in ipairs({ "!FIX:", "!FIXME:", "!BUG:", "!UGLY:", "!DEBUG:", "!HACK:" }) do
  keywords[keyword] = "red"
end
for _, keyword in ipairs({ "!REVIEW:", "!OPTIMIZE:", "!TSC:" }) do
  keywords[keyword] = "aqua"
end
keywords["!TODO:"] = "orange"
keywords["!IDEA:"] = "fuschia"

function Para(elem)
  local i = 1
  local highlighted = pandoc.RawInline('html', '<span>')

  while i <= #elem.content do
    local keyword, color
    for k, v in pairs(keywords) do
      if elem.content[i] and elem.content[i].tag == "Str" and elem.content[i].text:find("^" .. k) then
        keyword = k
        color = v
        break
      end
    end
    if keyword then
      local j = i
      while j <= #elem.content and not (elem.content[j].tag == "Str" and elem.content[j].text:find("%. %s")) do
        j = j + 1
      end
      if FORMAT:match 'html' or FORMAT:match 'revealjs' then
        highlighted = pandoc.RawInline('html', '<span style="background-color:' .. color .. '">')
      elseif FORMAT:match 'typst' then
        highlighted = pandoc.RawInline('typst', '#highlight(fill: ' .. color .. ')[')
      elseif FORMAT:match 'latex' then
        if color:match("aqua") then
          color = "cyan"
        elseif color:match("fuschia") then
          color = "magenta"
        end
        highlighted = pandoc.RawInline('latex', '\\colorbox{' .. color .. '}{\\parbox{\\dimexpr\\linewidth-2\\fboxsep}{')
      end
      for k = i, j do
        if elem.content[k] and elem.content[k].tag == "Str" then
          highlighted.text = highlighted.text .. elem.content[k].text .. ' '
          table.remove(elem.content, k) -- remove the original element
        end
      end
      if FORMAT:match 'html' or FORMAT:match 'revealjs' then
        highlighted.text = highlighted.text .. '</span>'
      elseif FORMAT:match 'typst' then
        highlighted.text = highlighted.text .. ']'
      elseif FORMAT:match 'latex' then
        highlighted.text = highlighted.text .. '}}'
      end
      table.insert(elem.content, i, highlighted)
      i = j
    else
      i = i + 1
    end
  end
  return elem
end
