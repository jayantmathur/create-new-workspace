#' Add General Trends to a Model
#'
#' This function adds general trends to a given
#' model by creating a list of 'geom_text'
#' elements for each variable in the model.
#'
#' Each 'geom_text' element contains the variable
#' name, its estimate, and its p-value.
#'
#' @param model A model to add general trends to.
#' @param max A numeric value representing the
#' maximum y-coordinate for the 'geom_text'
#' elements. Default is 0.
#' @param unit A numeric value representing the
#' unit increment for the y-coordinate of each
#' subsequent 'geom_text' element. Default is 0.
#'
#' @importFrom ggplot2 geom_text
#'
#' @return A list of 'geom_text' elements to be added to a ggplot.
#' @examples
#' \dontrun{
#' # Assuming 'model' is a valid model
#' geom_list <- add_gen_trends(model)
#'
#' ggplot() + geom_list
#' }
#' @export

ggadd_trends <- function(model, max = 0, unit = 0) {
    output <- myrutils::get_lm_writeup(model, type = "table")

    output <- output[rev(seq_len(nrow(output))), ]

    output$Variable <- gsub("nC", "n", output$Variable)
    output$Variable <- gsub("eC", "e", output$Variable)

    geom_list <- list()

    for (i in seq_len(nrow(output))) {
        geom_list[[i]] <- ggplot2::geom_text(
            y = max + unit + prod(i, 0.3, unit),
            label = paste0(
                "General effect of ",
                output[[i, "Variable"]],
                ",    b =",
                output[[i, "Estimate"]],
                if (output[[i, "p.value"]] < 0.001) {
                    ", p < 0.001"
                } else {
                    paste0(", p = ", output[[i, "p.value"]])
                }
            ),
            stat = "unique",
            check_overlap = TRUE
        )
    }

    return(geom_list)
}
