import { auth } from "@/auth"

export default async function Admin() {
    const session = await auth()
    return (
        <div>
            <p>Adminのトップページ</p>
            <p>権限のないページにアクセスした場合は、このページにリダイレクトされる</p>
            <div className="py-12">
                <p>ページ一覧</p>
                <ul>
                    {
                        PathList.map((path, index) => {
                            return (
                                <li key={path.path}>
                            <a className="text-blue-600" href={path.path}>{path.path}</a>：{path.text}
                        </li>
                        )
                    })
                }
                </ul>
            </div>
            <div className="py-12">
                <p>権限別の表示制御</p>
                <ul>
                    <li>role1：{session?.user?.role === 1 && 'role1だけにこの秘密の文字が見えてる'}</li>
                    <li>role3：{session?.user?.role === 3 && 'role3だけにこの秘密の文字が見えてる'}</li>
                    <li>role5：{session?.user?.role === 5 && 'role5だけにこの秘密の文字が見えてる'}</li>
                    <li>role6：{session?.user?.role === 6 && 'role6だけにこの秘密の文字が見えてる'}</li>
                    <li>role7：{session?.user?.role === 7 && 'role7だけにこの秘密の文字が見えてる'}</li>
                    <li>role1+3：{(session?.user?.role === 1 || session?.user?.role === 3) && 'role1と3だけにこの秘密の文字が見えてる'}</li>
                </ul>
            </div>
        </div>
    )
}

const PathList = [
  {
    path: "/admin/role_admin_1",
    text: '管理者ユーザー（role 1）のみ'
  },
  {
    path: "/admin/role_cs_3",
    text: 'CSユーザー（role 3）のみ'
  },
  {
    path: "/admin/role_manage_5",
    text: '管理部ユーザー（role 5）のみ'
  },
  {
    path: "/admin/role_enginer_6",
    text: 'エンジニアユーザー（role 6）のみ'
  },
  {
    path: "/admin/role_cslead_7",
    text: 'CSリーダーユーザー（rorle 7）のみ'
  },
]