#' Save rendered object as TIFF Image
#'
#' This function saves the rendered object
#' as a TIFF image in the directory specified.
#'
#' @param object The object to be saved.
#' @param filename The name of the file to be saved.
#'
#' @importFrom grDevices tiff dev.off
#'
#' @return NULL. The function is called for its side effect of saving an image.
#' @examples
#' \dontrun{
#' # Assuming 'plot' is a valid plot
#' save__tiff(plot)
#' }
#' @export

save_tiff <- function(object, filename = "tiff_object.tif") {
    tiff(
        filename = filename,
        width = 6.67,
        height = 6.67,
        units = "in",
        res = 1200,
        type = "cairo"
    )

    print(object)

    dev.off()
}
