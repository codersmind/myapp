import Link from "next/link";


export default async function Home() {
    return(<>
        <div>Auth Home Page</div>
        <Link href={'/login'}><button className="btn px-5 py-2">Go Login</button></Link>
        <Link href={'/dashboard'}><button className="btn px-5 py-2">Dashboard</button></Link>
    </>)
}