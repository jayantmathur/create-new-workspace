min_packages <- c("IRkernel", "tidyverse", "ggpubr", "devtools", "emmeans","stringi")
install.packages(
    min_packages,
    repos = "https://cloud.r-project.org"
)
IRkernel::installspec()
