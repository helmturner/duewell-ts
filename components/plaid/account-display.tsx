import { useContext } from "react"
import PlaidContext from "../../context/plaid"

const AccountsDisplay = () => {
    const { linkSuccess, isItemAccess } = useContext(PlaidContext)
    if (linkSuccess && isItemAccess) {
        return (
            <>
{/*
                <Products />
                <Items />
*/}
            </>
        )
    } else return (<></>)
}

export default AccountsDisplay