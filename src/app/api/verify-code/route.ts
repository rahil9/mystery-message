import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
    await dbConnect()
    try {
        const {username, code} = await request.json();
        const decodeUsername =  decodeURIComponent(username)
        const user = await UserModel.findOne({username: decodeUsername})

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {status: 500}
            )
        }

        const isCodeValid = user.verifyCode === code
        const isCodeExpired = new Date(user.verifyCodeExpiry) > new Date()
        if (isCodeValid && isCodeExpired) {
            user.isVerified = true
            await user.save()
            return Response.json(
                {
                    success: true,
                    message: "Account verified successfully"
                },
                {status: 200}
            )
        } else if (!isCodeExpired) {
            return Response.json(
                {
                    success: false,
                    message: "Verification code has expired, sign-in again to get a new code"
                },
                {status: 400}
            )
        } else {
            return Response.json(
                {
                    success: false,
                    message: "You have entered incorrect verification code"
                },
                {status: 400}
            )
        }

    } catch (error) {
        console.log('Error checking username', error)
        return Response.json({
            success: false,
            message: 'Error checking username'
        },{ status: 500 })
    }
}