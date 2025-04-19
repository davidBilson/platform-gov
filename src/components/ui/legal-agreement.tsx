import React from 'react'

const Legalagreement = () => {
  return (
    <section>
        <h1>{"Hire Contractor"}</h1>
        <h2>Legal Agreement</h2>
        <div>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit, excepturi! Ut facere aperiam voluptates exercitationem repellat quaerat, reprehenderit, similique voluptatem explicabo esse vel libero accusamus blanditiis debitis repellendus qui quasi omnis praesentium mollitia voluptate. Voluptates qui eos ad et sunt provident totam corrupti. Delectus voluptatibus tempore temporibus, nam nulla maxime!</p>
        </div>
        <div>
            <label htmlFor="">
                <input type="checkbox" />
                I agree
            </label>
            <label htmlFor="">
                <input type="checkbox" />
                I accept GovLink {"Global's"} commission terms
            </label>
        </div>
        <div>
            <button>Back</button>
            <button>Cancel</button>
            <button>Send Contract</button>
        </div>
    </section>
  )
}

export default Legalagreement