export { auth as middleware } from "@/auth"
/**
 * import { auth } from "@/auth"

export default auth((req) => {
    console.log('これだべべ', req.auth?.user)
    if (!req.auth) {
        const url = req.url.replace(req.nextUrl.pathname, '/login')
        return Response.redirect(url)
    }
})
**/

export const config = {
    matcher: ['/mypage'],
}