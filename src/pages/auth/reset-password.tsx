import React from 'react'

const Resetpassword = () => {
  return (
    <main className='pt-10 md:pt-20 px-5 md:px-6'>
        <section className='w-full max-w-2xl m-auto'>
            <h1 className='font-semibold text-lg md:text-xl text-center mb-6'>Reset Password</h1>

            <p className="text-xl text-center mb-6">
                Reset your password
            </p>

            <form className="flex flex-col gap-4 md:gap-6">

                <div className="mb-4">
                    <input
                        type="password" 
                        id="new_password" 
                        name="new_password" 
                        placeholder='New Password'
                        className="w-full max-w-[300px] mb-6 block m-auto h-[50px] bg-white border rounded-lg py-4 pl-5 text-boldblue text-sm font-medium outline-none placeholder:font-medium"
                        required
                    />
                    <input
                        type="password" 
                        id="confirm_password" 
                        name="confirm_password" 
                        placeholder='Confirm Password'
                        className="w-full max-w-[300px] block m-auto h-[50px] bg-white border rounded-lg py-4 pl-5 text-boldblue text-sm font-medium outline-none placeholder:font-medium"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="px-5 py-[11px] w-fit block m-auto min-w-[120px] bg-boldblue rounded-lg text-white text-sm font-semibold cursor-pointer"
                >
                    Reset
                </button>

            </form>
        </section>
    </main>
  )
}

export default Resetpassword