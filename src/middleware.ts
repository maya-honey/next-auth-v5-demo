import { auth } from "@/auth"
import { ADMIN_ROLES } from "./constants/admin"

export default auth((req, ) => {
    const nextUrlPath = req.nextUrl.pathname
    switch(nextUrlPath) {
        case '/mypage':
            if (!req.auth) {
                const url = req.url.replace(req.nextUrl.pathname, '/signin')
                return Response.redirect(url)
            }
            break
        case '/admin':
            if (! req.auth?.user?.role) {
                const url = req.url.replace(req.nextUrl.pathname, '/admin/signin')
                return Response.redirect(url)
            }
            break
        case '/admin/role_admin_1':
            if (req.auth?.user?.role !== ADMIN_ROLES.ADMIN) {
                const url = req.url.replace(req.nextUrl.pathname, '/admin')
                return Response.redirect(url)
            }
            break
        case '/admin/role_cs_3':
            if (req.auth?.user?.role !== ADMIN_ROLES.CS) {
                const url = req.url.replace(req.nextUrl.pathname, '/admin')
                return Response.redirect(url)
            }
            break
        case '/admin/role_manage_5':
            if (req.auth?.user?.role !== ADMIN_ROLES.MANAGE) {
                const url = req.url.replace(req.nextUrl.pathname, '/admin')
                return Response.redirect(url)
            }
            break
        case '/admin/role_enginer_6':
            if (req.auth?.user?.role !== ADMIN_ROLES.ENGINEER) {
                const url = req.url.replace(req.nextUrl.pathname, '/admin')
                return Response.redirect(url)
            }
            break
        case '/admin/role_cslead_7':
            if (req.auth?.user?.role !== ADMIN_ROLES.CSLEAD) {
                const url = req.url.replace(req.nextUrl.pathname, '/admin')
                return Response.redirect(url)
            }
            break
        default:
            break
    
    }
})

/*export const config = {
    matcher: ['/mypage', '/admin', '/admin/role_admin_1', '/admin/role_cs_3', '/admin/role_manage_5', '/admin/role_enginer_6', '/admin/role_cslead_7'],
}*/