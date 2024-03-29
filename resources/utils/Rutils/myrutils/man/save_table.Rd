% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/save_table.R
\name{save_table}
\alias{save_table}
\title{Save a table to a file}
\usage{
save_table(table, filename, align = NULL)
}
\arguments{
\item{table}{A data frame to be saved.}

\item{filename}{The name of the file where the table will be saved.}

\item{align}{A character vector specifying the alignment of the columns.}
}
\value{
No return value, called for side effects
}
\description{
This function saves a table (data frame) to a file using knitr's kable function.
The table is saved in markdown format.
The alignment of the columns can be specified with the align parameter.
If no alignment is specified, the first column is left-aligned and the rest are right-aligned.
}
\examples{
\dontrun{
save_table(mtcars, "mtcars.md")
}
}
