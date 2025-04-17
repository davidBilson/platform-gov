import React from 'react'

const Verification = () => {
  return (
    <main className='pt-10 md:pt-20 px-5 md:px-6'>
        <section className='w-full max-w-2xl m-auto'>
            <h1 className='font-semibold text-lg md:text-xl text-center mb-6'>Create Account</h1>

            {/* ternary will be used to interchange the texts below based on current operation*/}
            <p className="text-xl text-center mb-6">
                Enter the verification code sent to {"email@email.com"}
            </p>
            <p className="text-xl text-center mb-6">
                Your email has been verified, continue to phone verification
            </p>
            <p className="text-xl text-center mb-6">
                Enter the verification code sent to {"(123) 123 1234"}
            </p>
            
            <form className="flex flex-col gap-4 md:gap-6">
                <div className="mb-4">
                    <input
                        type="text" 
                        id="code" 
                        name="code" 
                        placeholder='Verification Code'
                        className="w-full max-w-[300px] block m-auto h-[50px] bg-white border rounded-lg py-4 pl-5 text-boldblue text-sm font-medium outline-none placeholder:font-medium"
                        required
                    />
                </div>
                <p className="text-center mt-2">
                    <span className="text-sm  cursor-pointer">
                        {"Didn't"} get a code? Resend
                    </span>
                </p>
                {/* email verification */}
                <button
                    type="submit"
                    className="px-5 py-[11px] w-fit block m-auto min-w-[120px] bg-boldblue rounded-lg text-white text-sm font-semibold cursor-pointer"
                    disabled
                >
                    Verify
                </button>
                {/* email has been verified here, proceed to phone verification */}
                <button
                    type="submit"
                    className="px-5 py-[11px] w-fit block m-auto min-w-[120px] bg-boldblue rounded-lg text-white text-sm font-semibold cursor-pointer"
                    disabled
                >
                    Send Verification Code to (123) 123 1234
                </button>
                <button
                    type="submit"
                    className="px-5 py-[11px] w-fit block m-auto min-w-[120px] bg-boldblue rounded-lg text-white text-sm font-semibold cursor-pointer"
                    disabled
                >
                    Continue to account creation
                </button>
            </form>
        </section>
    </main>
  )
}

export default Verification;