import React from 'react';

const Forgotpassword = () => {
  return (
    <main className='pt-10 md:pt-20 px-3 md:px-6'>
      <section className='w-full max-w-2xl m-auto'>
        <h1 className='font-semibold text-lg md:text-xl text-center mb-6'>Forgot Password</h1>

        <p className="text-xl text-center mb-6">
          Enter your email to receive a recovery code
        </p>

        <form className="flex flex-col gap-4 md:gap-6">
          <div className="mb-4">
            <input
             type="email" 
             id="email" 
             name="email" 
             value={""}
             placeholder='Email'
             className={`w-full max-w-[300px] block m-auto h-[50px] bg-white border rounded-lg py-4 pl-5 text-boldblue text-sm font-medium outline-none placeholder:font-medium`}
             required
            />
          </div>
          <button
                type="submit"
                className={`px-5 py-[11px] w-fit block m-auto min-w-[120px] bg-boldblue rounded-lg text-white text-sm font-semibold cursor-pointer`}
              >
              Submit
            </button>
        </form>
        </section>
    </main>
  );
};

export default Forgotpassword;