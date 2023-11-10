#' Clean up Qualtrics survey data
#'
#' This function takes in a data frame and cleans up the data by
#' removing unnecessary text from the beginning of each column name
#' and from the end of the first row.
#'
#' It also renames the columns with the cleaned up names.
#' The resulting cleaned up data is returned.
#'
#' @param data A data frame to be cleaned up
#'
#' @return A cleaned up data frame
#'
#' @importFrom dplyr select contains starts_with
#'
#' @examples
#' data <- data.frame(matrix(1:9, nrow = 3, ncol = 3))
#' cleaned_data <- data.clean(data)
#'
#' @export
data.clean <- function(data) {
    data <- select(
        data[-2, ],
        contains(c("Q", "condition", "randomfield")) & !contains(c("NPS", "Browser", "Version", "System", "Resolution", "Click"))
    )

    # specifically to remove tutorial stuff
    # data = select(data, !starts_with("QID17"))

    data[1, ] <- lapply(
        data[1, ],
        function(x) {
            gsub(".*statements. - ", "", x)
        }
    )
    data[1, ] <- lapply(
        data[1, ],
        function(x) {
            sub("\r\n.*", "", x)
        }
    )
    data[1, ] <- lapply(
        data[1, ],
        function(x) {
            gsub("Timing - ", "", x)
        }
    )
    data[1, ] <- lapply(
        data[1, ],
        function(x) {
            gsub(" Cognitive Load", "", x)
        }
    )

    # colnames(data)= makeInitials(data[1,])
    colnames(data) <- data[1, ]
    data <- data[-1, ]

    return(data)
}
