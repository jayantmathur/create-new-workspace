#' Remove all R packages except those specified
#'
#' @param exclude A character vector of package names to keep.
#' @importFrom utils installed.packages remove.packages
#'
#' @return A message indicating the packages that have been removed.
#' @examples
#' \dontrun{
#' reset_packages(exclude = c("tidyverse"))
#' }
#' @export

reset_packages <- function(exclude = c()) {
    # Get the list of all installed packages
    all_packages <- installed.packages()[, "Package"]

    all_excludes <- c(
        "jsonlite",
        "languageserver",
        "IRkernel",
        "devtools",
        exclude
    )

    # Find the packages to remove
    remove_packages <- setdiff(all_packages, all_excludes)

    # Remove the packages
    sapply(remove_packages, remove.packages)

    return(
        paste(
            "All packages removed excluding: ", paste(
                remove_packages,
                collapse = ", "
            )
        )
    )
}
