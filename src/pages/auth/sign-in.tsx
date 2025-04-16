import Link from 'next/link'
import React from 'react'

const Login = () => {
  return (
    <main className='pt-20'>
        <section className='w-full max-w-2xl m-auto'>
            <h1 className='font-semibold text-xl text-center mb-10'>Login</h1>
            <form>
                <div>
                    <input type="email" id="email" name="email" required />
                </div>
                <div>
                    <input type="password" id="password" name="password" required />
                </div>
                <button type="submit">Login</button>
                <Link href={"/forgot-password"}></Link>
                <p>{"Don't"} have an account? <Link href={"/auth/sign-up"}>Sign up</Link></p>
            </form>
        </section>
    </main>
  )
}

export default Login