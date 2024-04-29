export default function Token({ params }: {
    params: {
        token: string
    }
}) {
    return (
        <div>Token: {params.token}</div>
    )
}