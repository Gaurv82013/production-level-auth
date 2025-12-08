import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <section className='my-8 flex justify-center'>
        <SignIn/>
    </section>
  )
}