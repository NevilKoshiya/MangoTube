import { ConnectToDatabase } from "@/lib/db";
import { User } from "@/models/User.js";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json();
        const { username, email, fullname, password, avatar, coverImage, provider } = body;

        if (!username || !email || !fullname || !password || !avatar || !coverImage || !provider) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        await ConnectToDatabase();

        const existingUser = await User.findOne({$or : [{email},{username}]});
        
        if (existingUser?.email === email) {
            return NextResponse.json({ message: "You are already registered" }, { status: 400 });
        }

        if(existingUser?.username === username){
            return NextResponse.json({ message: "This username is alreadt taken" }, { status: 400 });
        }

        const newUser = await User.create({
            username,
            email,
            fullname,
            password,
            avatar,
            coverImage,
            provider
        });

        return NextResponse.json({
            message: "Successfully created new user",
            user: newUser,
            done: true
        }, { status: 201 });

    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({
            message: "Something went wrong on the server, please try again later",
            error: error.message
        }, { status: 500 });
    }
}
