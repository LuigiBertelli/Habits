import { Link } from "react-router-dom"

export const Signup = () => {
    return (
      <div className="w-full max-w-5xl px-6">
          <div className="text-center h-[17.5rem]">
              <span>
                  Do you already have an account? {' '}
                  <Link className="text-violet-500" to='/login'>
                      Sign in
                  </Link>
              </span>
          </div>
      </div>
    )
  }