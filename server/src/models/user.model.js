import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import {
    ADDRESS_TYPES,
    BCRYPT_SALT_ROUNDS,
    PASSWORD_MIN_LENGTH,
    USER_ROLES,
    USER_STATUS,
} from "../constants/user.constants.js";

const addressSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: Object.values(ADDRESS_TYPES),
            default: ADDRESS_TYPES.HOME,
        },

        fullName: {
            type: String,
            trim: true,
            maxlength: 100,
        },

        phone: {
            type: String,
            trim: true,
            match: [/^\+?[1-9]\d{7,14}$/, "Please provide a valid phone number"],
        },

        street: {
            type: String,
            trim: true,
            maxlength: 200,
        },

        city: {
            type: String,
            trim: true,
            maxlength: 100,
        },

        state: {
            type: String,
            trim: true,
            maxlength: 100,
        },

        postalCode: {
            type: String,
            trim: true,
            maxlength: 20,
        },

        country: {
            type: String,
            trim: true,
            maxlength: 100,
        },

        isDefault: {
            type: Boolean,
            default: false,
        },
    },
    {
        _id: true,
    }
);

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
            minlength: [2, "First name must be at least 2 characters"],
            maxlength: [50, "First name cannot exceed 50 characters"],
        },

        lastName: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
            minlength: [2, "Last name must be at least 2 characters"],
            maxlength: [50, "Last name cannot exceed 50 characters"],
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Please provide a valid email address",
            ],
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [
                PASSWORD_MIN_LENGTH,
                `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
            ],
            select: false,
        },

        phone: {
            type: String,
            trim: true,
            match: [/^\+?[1-9]\d{7,14}$/, "Please provide a valid phone number"],
        },

        role: {
            type: String,
            enum: Object.values(USER_ROLES),
            default: USER_ROLES.USER,
            index: true,
        },

        status: {
            type: String,
            enum: Object.values(USER_STATUS),
            default: USER_STATUS.ACTIVE,
            index: true,
        },

        isEmailVerified: {
            type: Boolean,
            default: false,
        },

        emailVerificationToken: {
            type: String,
            select: false,
        },

        emailVerificationExpiresAt: {
            type: Date,
            select: false,
        },

        passwordResetToken: {
            type: String,
            select: false,
        },

        passwordResetExpiresAt: {
            type: Date,
            select: false,
        },

        passwordChangedAt: {
            type: Date,
        },

        tokenVersion: {
            type: Number,
            default: 0,
            select: false,
        },

        addresses: {
            type: [addressSchema],
            default: [],
        },

        lastLoginAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
        versionKey: false,
        optimisticConcurrency: true,
        toJSON: {
            transform(_doc, ret) {
                delete ret.password;
                delete ret.emailVerificationToken;
                delete ret.emailVerificationExpiresAt;
                delete ret.passwordResetToken;
                delete ret.passwordResetExpiresAt;
                delete ret.tokenVersion;
                return ret;
            },
        },
    }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1, status: 1 });
userSchema.index({ passwordResetToken: 1 });
userSchema.index({ emailVerificationToken: 1 });

userSchema.pre("save", async function hashPasswordBeforeSave(next) {
    if (!this.isModified("password")) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, BCRYPT_SALT_ROUNDS);

    if (!this.isNew) {
        this.passwordChangedAt = new Date(Date.now() - 1000);
        this.tokenVersion += 1;
    }

    return next();
});

userSchema.methods.comparePassword = async function comparePassword(
    candidatePassword
) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.createPasswordResetToken =
    function createPasswordResetToken() {
        const resetToken = crypto.randomBytes(32).toString("hex");

        this.passwordResetToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        this.passwordResetExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

        return resetToken;
    };

userSchema.methods.createEmailVerificationToken =
    function createEmailVerificationToken() {
        const verificationToken = crypto.randomBytes(32).toString("hex");

        this.emailVerificationToken = crypto
            .createHash("sha256")
            .update(verificationToken)
            .digest("hex");

        this.emailVerificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        return verificationToken;
    };

userSchema.methods.changedPasswordAfter = function changedPasswordAfter(
    jwtIssuedAt
) {
    if (!this.passwordChangedAt) {
        return false;
    }

    const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);

    return jwtIssuedAt < changedTimestamp;
};

const User = mongoose.model("User", userSchema);

export default User;