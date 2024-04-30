export default function Admin() {
    return (
        <div>
            <p>Adminのトップページ</p>
            <p>権限のないページにアクセスした場合は、このページにリダイレクトされる</p>
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