import Link from "next/link";


export default async function Login() {
    const resp = await fetch('https://jsonplaceholder.typicode.com/todos/1');

    if(!resp.ok){
        return <h1>{resp.status}</h1>
    }

    const data = await resp.json()
    

    return(
        <div className="bg-slate-300 w-full min-h-fit">
            <h1 className="text-4xl text-amber-600">Login {JSON.stringify(data)}</h1>
             <Link href={'/home'}><button className="btn px-5 py-2">Go Home</button></Link>
        </div>
    )
}