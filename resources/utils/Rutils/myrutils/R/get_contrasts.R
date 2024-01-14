#' Get Contrasts
#'
#' This function is used to get contrasts from a given model and vector.
#'
#' @param model A model object. Provide lmer models with interactions.
#' @param vector A vector. Provide a vector of the form ~ A | B.
#'
#' @return A data frame with the contrasts.
#'
#' @importFrom emmeans emmeans contrast
#' @importFrom dplyr mutate across slice
#'
#' @examples
#' \dontrun{
#' score_model <- lmer(
#'     Score ~ Condition + Stage + Condition:Stage + (1 | PID),
#'     data = data,
#'     control = control
#' )
#'
#' get_contrasts(score_model, ~ Stage | Condition)
#'
#' kg_model <- lmer(
#'     Score ~ Condition + Process + Quiz + Condition:Quiz + Process:Quiz + Condition:Process + Condition:Process:Quiz + (1 | ParticipantID),
#'     data = data,
#'     control = control
#' )
#'
#' get_contrasts(kg_model, ~ Quiz | Condition:Process)
#' }
#'
#' @export

get_contrasts <- function(model, vector) {
    output <- as.data.frame(
        emmeans::contrast(
            emmeans::emmeans(model, vector),
            method = "pairwise"
        )
    )

    # output <- dplyr::slice(
    #     output,
    #     2, 4
    # )[, -c(1, 4, 5)]

    output <- dplyr::mutate(
        output,
        estimate = estimate * 2, # nolint
        dplyr::across(
            .cols = -1:3,
            .fns = ~ round(.x, 3)
        )
    )

    return(output)
}
