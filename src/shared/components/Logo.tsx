import { Link } from 'react-router-dom'

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 text-lg font-bold">
      <span className="flex size-8 items-center justify-center rounded-lg bg-linear-to-br from-primary to-accent text-primary-foreground">
        E
      </span>
      Easygenerator
    </Link>
  )
}

export default Logo
