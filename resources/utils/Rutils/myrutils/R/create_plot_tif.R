#' Save a ggplot2 plot to a tiff file
#'
#' This function saves a ggplot2 plot to a tiff file with a specified filename.
#' The file is saved with a resolution of 1200 dpi.
#'
#' @param plot The ggplot2 plot to be saved.
#' @param filename The name of the file (without extension) to which the plot will be saved.
#'
#' @importFrom ggplot2 ggsave
#'
#' @return None. This function is called for its side effect of saving a file.
#' @export
#' @examples
#' \dontrun{
#' create_plot_tif(my_plot, "my_plot_filename")
#' }
#'
create_plot_tif <- function(plot, filename) {
    ggplot2::ggsave(
        paste0(
            filename,
            ".tif"
        ),
        plot,
        device = "tiff",
        dpi = 1200
    )
}
