import Link from 'next/link';
import Button from '@/components/buttons/Button';
const LoggedOutComponent = () => {
    return (
        <>
            <Link href="/login">
                <Button>Login</Button>
            </Link>
            <Link href="/register">
                <Button>Register</Button>
            </Link>
        </>
    )
}

export default LoggedOutComponent