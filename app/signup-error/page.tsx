import Link from 'next/link'

export default function Page() {
  return (
    <div>
      <p>An error has occured while signing up.</p>
      <p>Please try again or contact support.</p>
      <Link href='/'>Go back to home page</Link>
    </div>
  )
}
