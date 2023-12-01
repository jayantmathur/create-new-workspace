import ThemeProvider from "@/providers/next-theme"

const Providers = ({children}:{children:React.ReactNode}) => (<>
  <ThemeProvider>
    {children}
  </ThemeProvider>
</>);

export default Providers;