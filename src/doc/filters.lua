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
