# Style Guide

## Click Effect For Buttons
transition transform active:scale-95 hover:opacity-70  duration-300 ease-in-out cursor-pointer

## Hover Effect For Buttons
hover:opacity-70 transition duration-300 ease-in-out

## Focus Effect For Input Fields
focus:outline focus:outline-boldblue

 # <-- TREASURE ISLOADING -->
 # <-- convert this into a reusable UI component -->
  <!-- 

  if (isLoading) {
    return (
      <section className='h-screen w-full fixed top-0 left-0 z-50 bg-red-500 flex items-center justify-end'>
        <section className='w-full h-screen bg-skyblue p-4 md:p-7.5 overflow-y-auto'>
          <div className='w-full max-w-275 m-auto pb-32 md:pb-64 flex items-center justify-center h-full'>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-boldblue"></div>
          </div>
        </section>
      </section>
    );
  } 

  -->