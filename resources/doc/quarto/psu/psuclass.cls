%------------------------------------------------%
\NeedsTeXFormat{LaTeX2e}[1995/06/01]
\ProvidesClass{psuclass}[2019/07/10 v2.9.2 psuthesis class]
\RequirePackage{ifthen}

%------------------------------------------------%
% Declare options for different degree types.
% Allowable degrees are:
%     Ph.D. using class option <phd>
%     M.S. using class option <ms>
%
% The option of an option sets the boolean for that option to
% true and all others to false.
%------------------------------------------------%
\newboolean{psu@ms}
\newboolean{psu@phd}
\newboolean{psu@toc}

\setboolean{psu@ms}{false}

\setboolean{psu@phd}{false}


\DeclareOption{ms}{\setboolean{psu@ms}{true}\setboolean{psu@phd}{false}}

\DeclareOption{phd}{\setboolean{psu@phd}{true}}

\DeclareOption{draft}{\PassOptionsToClass{\CurrentOption}{book}}
\DeclareOption{10pt}{\PassOptionsToClass{\CurrentOption}{book}}
\DeclareOption{11pt}{\PassOptionsToClass{\CurrentOption}{book}}
\DeclareOption{12pt}{\PassOptionsToClass{\CurrentOption}{book}}
\DeclareOption*{\PackageWarning{psuthesis}{Unknown option `\CurrentOption'. Ignoring}}
\ExecuteOptions{phd} % the default option is <phd>
\ProcessOptions
\LoadClass[openany,oneside]{book}
\RequirePackage{calc}
\RequirePackage{setspace}
% If you are using the subfigure package, load the tocloft package with
% the subfigure option and comment out the next line.
\RequirePackage[titles]{tocloft}
\RequirePackage{fancyhdr}
\RequirePackage[overload]{textcase}
\RequirePackage[letterpaper, left = 1.4in, right = 0.9in, top = 0.9in, bottom = 0.9in, includeheadfoot]{geometry}
\RequirePackage{twoopt}
\RequirePackage{titlesec}
\RequirePackage[sort&compress,numbers]{natbib}

%------------------------------------------------%
% Settings for tocloft %

\renewcommand{\@pnumwidth}{1.75em} % remove TOC margin errors
\renewcommand{\@tocrmarg}{2.75em}
\newlength{\mylength}% a "scratch" length
\newlength{\mylonglength}% another "scratch" length
\ifthenelse{\boolean{psu@toc}}
{%

% if true (?) do nothing
% originally it was Format chapter entries so that the chapter name goes on a line
% following "Chapter #".

}
{
%  else
% Format chapter entries so that the chapter name goes on the same line
% as "Chapter #".
\renewcommand{\cftchappresnum}{Chapter }
\settowidth{\mylength}{\bfseries\cftchappresnum\cftchapaftersnum}% extra space
\addtolength{\cftchapnumwidth}{\mylength} % add the extra space
%
\newcommand{\mylongname}{Appendix }% the longest chapter number header
\settowidth{\mylonglength}{\bfseries\mylongname\cftchapaftersnum}% extra space
}%


%------------------------------------------------%
% Store the title of the thesis.
\newcommand{\psu@title}{Theory of Everything}
\renewcommand{\title}[1]{\renewcommand{\psu@title}{#1}}

% Store the author's name.
\newcommand{\psu@author}{Richard Feynman}
\renewcommand{\author}[1]{\renewcommand{\psu@author}{#1}}

% Store the department name.
\newcommand{\psu@dept}{ESM}
\providecommand{\dept}[1]{\renewcommand{\psu@dept}{#1}}

% Store the date the degree will be conferred.
\newcommand{\psu@degreedate}{May 1900}
\providecommand{\degreedate}[1]{\renewcommand{\psu@degreedate}{#1}}

% Store the year of the copyright.
\newcommand{\psu@copyrightyear}{1900}
\providecommand{\copyrightyear}[1]{\renewcommand{\psu@copyrightyear}{#1}}

% Store the document type.
\newcommand{\psu@documenttype}{Thesis}
\providecommand{\documenttype}[1]{\renewcommand{\psu@documenttype}{#1}}

% Store the academic unit to which the document has been submitted.
\newcommand{\psu@submittedto}{The Graduate School}
\providecommand{\submittedto}[1]{\renewcommand{\psu@submittedto}{#1}}

% Store the College to which the document has been submitted.
\newcommand{\psu@collegesubmittedto}{College of Engineering}
\providecommand{\collegesubmittedto}[1]{\renewcommand{\psu@collegesubmittedto}{#1}}


%------------------------------------------------%
% Store the name of the degree by determining which boolean was
% set in the class option was specified.
%------------------------------------------------%
\ifthenelse{\boolean{psu@ms}}%
{\newcommand{\psu@degreetype}{Master of Science}}%
{}

\ifthenelse{\boolean{psu@phd}}%
{\newcommand{\psu@degreetype}{Doctor of Philosophy}}%
{}

%------------------------------------------------%
% Store the number of readers in \psu@readers. This quantity is
% input in the main file using the \numberofreaders command.
%------------------------------------------------%
\newcommand{\psu@readers}{4}
\providecommand{\numberofreaders}[1]{\renewcommand{\psu@readers}{#1}}


\newcommand{\psu@advisor}{John Doe}
\newcommand{\psu@advisortitle}{John Doe}
\newcommand{\psu@advisoroptionone}{}%
\newcommand{\psu@advisoroptiontwo}{}%
\providecommandtwoopt{\advisor}[4][][]%
{\renewcommand{\psu@advisoroptionone}{#1}%
\renewcommand{\psu@advisoroptiontwo}{#2}%
\renewcommand{\psu@advisor}{#3}%
\renewcommand{\psu@advisortitle}{#4}}

\newcommand{\psu@readerone}{John Doe}
\newcommand{\psu@readeronetitle}{John Doe}
\newcommand{\psu@readeroneoption}{}%
\providecommand{\readerone}[3][]%
{\renewcommand{\psu@readeroneoption}{#1}%
\renewcommand{\psu@readerone}{#2}%
\renewcommand{\psu@readeronetitle}{#3}}

\newcommand{\psu@readertwo}{John Doe}
\newcommand{\psu@readertwotitle}{John Doe}
\newcommand{\psu@readertwooption}{}%
\providecommand{\readertwo}[3][]%
{\renewcommand{\psu@readertwooption}{#1}%
\renewcommand{\psu@readertwo}{#2}%
\renewcommand{\psu@readertwotitle}{#3}}

\newcommand{\psu@readerthree}{John Doe}
\newcommand{\psu@readerthreetitle}{John Doe}
\newcommand{\psu@readerthreeoption}{}%
\providecommand{\readerthree}[3][]%
{\renewcommand{\psu@readerthreeoption}{#1}%
\renewcommand{\psu@readerthree}{#2}%
\renewcommand{\psu@readerthreetitle}{#3}}


\newsavebox{\tempbox}
\renewcommand{\@makecaption}[2]{%
\vspace{7pt}\sbox{\tempbox}{\small\textbf{#1.} #2}%
\ifthenelse{\lengthtest{\wd\tempbox > \linewidth}}%
{\small\textbf{#1.} #2\par}%
{\centering \small\textbf{#1.} #2}%
}

%------------------------------------------------%
% The actual layout begins here. %
%------------------------------------------------%

\fancypagestyle{plain}{% Redefining plain page style
  \fancyhf{} %clear all header and footer fields
  \fancyhead[R]{\thepage}
}

\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

\setlength{\headheight}{13.59999pt}
\titlespacing*{\chapter}{0pt}{-20pt}{40pt}

\titlespacing*{\section}{0pt}{50pt}{2.3ex plus .2ex}

\titlespacing*{\subsection}{0pt}{50pt}{1.5ex plus .2ex}

% Here is the title page.
\newcommand{\psutitlepage}{%
\setcounter{page}{1}
\thispagestyle{empty}%


{
\vspace*{-0.25in}
\begin{center}
	The Pennsylvania State University\\
	\psu@submittedto \\
	% \psu@collegesubmittedto
\end{center}
\vfill
\begin{center}
    \setstretch{2}
    \bfseries\uppercase\expandafter{\psu@title}
\end{center}
\vfill
\begin{center}
    A \psu@documenttype\ in\\
    \psu@dept\\
    by\\
    \psu@author\\
\end{center}
\vfill
\begin{center}
    \copyright\ \psu@copyrightyear\ \psu@author
\end{center}
\vfill
\begin{center}
    Submitted in Partial Fulfillment\\
    of the Requirements\\
    for the Degree of
\end{center}
\vfill
\begin{center}
     \psu@degreetype
\end{center}
\vfill
\begin{center}
    \psu@degreedate
\end{center}

}

\restoregeometry
\newpage
}


% Here is the committee page.

\newlength{\psu@sigoptionskip}
\newlength{\psu@sigafteroptionskip}
\newlength{\psu@intersigspace}

\newcommand{\psucommitteepage}{%
    \ifthenelse{\psu@readers = 6}{%
        \setlength{\psu@sigafteroptionskip}{1.0\baselineskip}
        \setlength{\psu@intersigspace}{1.0\baselineskip}
    }%
    {%
        \setlength{\psu@sigafteroptionskip}{1.5\baselineskip}
        \setlength{\psu@intersigspace}{1.5\baselineskip}
    }
    \vspace*{-0.2in}
    \noindent {\normalsize The \MakeTextLowercase{\psu@documenttype} of \psu@author\ was reviewed and approved by the following:}\\[3\baselineskip]
\mbox{}\hfill
\parbox{\textwidth - 0.5in}{
         \psu@advisor\\[\psu@sigoptionskip]
         \psu@advisortitle
         \ifthenelse{\equal{\psu@advisoroptionone}{}}%
                    {\\[\psu@intersigspace]}%
                    {\\[\psu@sigoptionskip]
                        \psu@advisoroptionone \\ \psu@advisoroptiontwo \\[\psu@sigafteroptionskip]}
\ifcase \psu@readers
\or
          \psu@readerone\\[\psu@sigoptionskip]
          \psu@readeronetitle
          \ifthenelse{\equal{\psu@readeroneoption}{}}%
                     {}%
                     {\\[\psu@sigoptionskip] \psu@readeroneoption}
\or
          \psu@readerone\\[\psu@sigoptionskip]
          \psu@readeronetitle
          \ifthenelse{\equal{\psu@readeroneoption}{}}%
                     {\\[\psu@intersigspace]}%
                     {\\[\psu@sigoptionskip]
                               \psu@readeroneoption \\[\psu@sigafteroptionskip]}
          \psu@readertwo\\[\psu@sigoptionskip]
          \psu@readertwotitle
          \ifthenelse{\equal{\psu@readertwooption}{}}%
                     {}%
                     {\\[\psu@sigoptionskip] \psu@readertwooption}
\or
          {\psu@readerone}\\[\psu@sigoptionskip]
          \psu@readeronetitle
          \ifthenelse{\equal{\psu@readeroneoption}{}}%
                     {\\[\psu@intersigspace]}%
                     {\\[\psu@sigoptionskip]
                               \psu@readeroneoption \\[\psu@sigafteroptionskip]}
          {\psu@readertwo}\\[\psu@sigoptionskip]
          \psu@readertwotitle
          \ifthenelse{\equal{\psu@readertwooption}{}}%
                     {\\[\psu@intersigspace]}%
                     {\\[\psu@sigoptionskip]
                               \psu@readertwooption \\[\psu@sigafteroptionskip]}
          {\psu@readerthree}\\[\psu@sigoptionskip]
          \psu@readerthreetitle
          \ifthenelse{\equal{\psu@readerthreeoption}{}}%
                     {}%
                     {\\[\psu@sigoptionskip] \psu@readerthreeoption}
\or
          \psu@readerone\\[\psu@sigoptionskip]
          \psu@readeronetitle
          \ifthenelse{\equal{\psu@readeroneoption}{}}%
                     {\\[\psu@intersigspace]}%
                     {\\[\psu@sigoptionskip]
                               \psu@readeroneoption \\[\psu@sigafteroptionskip]}
          \psu@readertwo\\[\psu@sigoptionskip]
          \psu@readertwotitle
          \ifthenelse{\equal{\psu@readertwooption}{}}%
                     {\\[\psu@intersigspace]}%
                     {\\[\psu@sigoptionskip]
                               \psu@readertwooption \\[\psu@sigafteroptionskip]}
          \psu@readerthree\\[\psu@sigoptionskip]
          \psu@readerthreetitle
          \ifthenelse{\equal{\psu@readerthreeoption}{}}%
                     {\\[\psu@intersigspace]}%
                     {\\[\psu@sigoptionskip]
                               \psu@readerthreeoption \\[\psu@sigafteroptionskip]}
          \psu@readerfour\\[\psu@sigoptionskip]
          \psu@readerfourtitle
          \ifthenelse{\equal{\psu@readerfouroption}{}}%
                     {}%
                     {\\[\psu@sigoptionskip] \psu@readerfouroption}
\or
          \psu@readerone\\[\psu@sigoptionskip]
          \psu@readeronetitle
          \ifthenelse{\equal{\psu@readeroneoption}{}}%
                     {\\[\psu@intersigspace]}%
                     {\\[\psu@sigoptionskip]
                               \psu@readeroneoption \\[\psu@sigafteroptionskip]}
          \psu@readertwo\\[\psu@sigoptionskip]
          \psu@readertwotitle
          \ifthenelse{\equal{\psu@readertwooption}{}}%
                     {\\[\psu@intersigspace]}%
                     {\\[\psu@sigoptionskip]
                               \psu@readertwooption \\[\psu@sigafteroptionskip]}
          \psu@readerthree\\[\psu@sigoptionskip]
          \psu@readerthreetitle
          \ifthenelse{\equal{\psu@readerthreeoption}{}}%
                     {\\[\psu@intersigspace]}%
                     {\\[\psu@sigoptionskip]
                               \psu@readerthreeoption \\[\psu@sigafteroptionskip]}
          \psu@readerfour\\[\psu@sigoptionskip]
          \psu@readerfourtitle
          \ifthenelse{\equal{\psu@readerfouroption}{}}%
                     {\\[\psu@intersigspace]}%
                     {\\[\psu@sigoptionskip]
                               \psu@readerfouroption \\[\psu@sigafteroptionskip]}
          \psu@readerfive\\[\psu@sigoptionskip]
          \psu@readerfivetitle
          \ifthenelse{\equal{\psu@readerfiveoption}{}}%
                     {}%
                     {\\[\psu@sigoptionskip] \psu@readerfiveoption}
\or
          \psu@readerone\\[\psu@sigoptionskip]
          \psu@readeronetitle
          \ifthenelse{\equal{\psu@readeroneoption}{}}%
                     {\\[\psu@intersigspace]}%
                     {\\[\psu@sigoptionskip]
                               \psu@readeroneoption \\[\psu@sigafteroptionskip]}
          \psu@readertwo\\[\psu@sigoptionskip]
          \psu@readertwotitle
          \ifthenelse{\equal{\psu@readertwooption}{}}%
                     {\\[\psu@intersigspace]}%
                     {\\[\psu@sigoptionskip]
                               \psu@readertwooption \\[\psu@sigafteroptionskip]}
          \psu@readerthree\\[\psu@sigoptionskip]
          \psu@readerthreetitle
          \ifthenelse{\equal{\psu@readerthreeoption}{}}%
                     {\\[\psu@intersigspace]}%
                     {\\[\psu@sigoptionskip]
                               \psu@readerthreeoption \\[\psu@sigafteroptionskip]}
          \psu@readerfour\\[\psu@sigoptionskip]
          \psu@readerfourtitle
          \ifthenelse{\equal{\psu@readerfouroption}{}}%
                     {\\[\psu@intersigspace]}%
                     {\\[\psu@sigoptionskip]
                               \psu@readerfouroption \\[\psu@sigafteroptionskip]}
          \psu@readerfive\\[\psu@sigoptionskip]
          \psu@readerfivetitle
          \ifthenelse{\equal{\psu@readerfiveoption}{}}%
                     {\\[\psu@intersigspace]}%
                     {\\[\psu@sigoptionskip]
                               \psu@readerfiveoption \\[\psu@sigafteroptionskip]}
          \psu@readersix\\[\psu@sigoptionskip]
          \psu@readersixtitle
          \ifthenelse{\equal{\psu@readersixoption}{}}%
                     {}%
                     {\\[\psu@sigoptionskip] \psu@readersixoption}
\fi
}

\mbox{}\vfill

\noindent
% \parbox{\textwidth}{$^{*}$Signatures are on file in the Graduate School.}

\newpage
}

% Chapter title formatting
\titleformat{\chapter}[display]{\normalfont\fontsize{11pt}{0pt}\bfseries\filcenter}{Chapter \thechapter}{13pt}{\MakeUppercase}{\fontsize{14pt}{0pt}\bfseries\filcenter} % this second part is the chapter title

% Section title formatting
\titleformat{\section}[block]{\normalfont\fontsize{11pt}{0pt}\bfseries}{\thesection.}{1.25em}{\MakeUppercase}

% Subsection title formatting
\titleformat{\subsection}[block]{\normalfont\fontsize{11pt}{0pt}\bfseries}{\thesubsection.}{1em}{}

% Subsubsection title formatting
\titleformat{\subsubsection}[block]{\normalfont\fontsize{11pt}{0pt}\bfseries}{\thesubsubsection.}{1em}{}

\newcommand{\thesisabstract}[1]{
\chapter*{Abstract}
    \begin{doublespace}
        \input{#1}
    \end{doublespace}
\newpage
}

\renewcommand{\cftchapleader}{\cftdotfill{\cftdotsep}}

\renewcommand{\contentsname}{Table of Contents}
\setcounter{secnumdepth}{10}
\setcounter{tocdepth}{4}
\newcommand{\thesistableofcontents}{%
    \begin{singlespace}
        \chapter*{\contentsname}
        \@starttoc{toc}%
    \end{singlespace}
    \clearpage
}

\renewcommand{\listfigurename}{List of Figures}
\renewcommand{\cftfigpresnum}{Figure~}
\setlength{\cftfignumwidth}{6em}
\renewcommand{\cftfigaftersnum}{:}
\newcommand{\thesislistoffigures}{%
    \begin{doublespace}
        \chapter{\listfigurename}
        \@starttoc{lof}%
    \end{doublespace}
    \clearpage
}


\renewcommand{\listtablename}{List of Tables}
\renewcommand{\cfttabpresnum}{Table~}
\setlength{\cfttabnumwidth}{6em}
\renewcommand{\cfttabaftersnum}{:}
\newcommand{\thesislistoftables}{%
    \begin{doublespace}
        \chapter{\listtablename}
        \@starttoc{lot}%
    \end{doublespace}
    \clearpage
}

\newcommand{\thesisacknowledgments}[1]{%
    \chapter{Acknowledgments}
    \begin{doublespace}
        \input{#1}
    \end{doublespace}
}


\newcommand{\Appendix}{\@dblarg\my@Appendix}
\def\my@Appendix[#1]#2{%
\ifthenelse{\value{chapter} = 0}
{
\ifthenelse{\boolean{psu@toc}}
{
\addtocontents{toc}{\protect\addtolength{\cftchapnumwidth}{-\mylength}}
\addtocontents{toc}{\string\renewcommand{\string\cftchappresnum}{Appendix }}
\addtocontents{toc}{\protect\addtolength{\cftchapnumwidth}{\mylonglength}}
}

{
\addtocontents{toc}{\string\renewcommand{\string\cftchappresnum}{Appendix }}
}}{}%
\chapter[#1]{#2}
}

%------------------------------------------------%
\DeclareRobustCommand{\thesismainmatter}{\mainmatter}
%------------------------------------------------%
% End of file `psuthesis.cls'.