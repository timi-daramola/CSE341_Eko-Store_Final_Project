const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const dotenv = require('dotenv');
const userModel = require('./models/userModel'); // Import user model
dotenv.config();

// Serialize user information into the session
passport.serializeUser((user, done) => {
    done(null, user._id); // Save the user ID in the session
});

// Deserialize user information from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findUserById(id); // Retrieve user from the database
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Configure the GitHub OAuth strategy
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Create or find the user in the database
                const user = await userModel.createUser({
                    githubId: profile.id,
                    username: profile.username,
                    displayName: profile.displayName,
                    profileUrl: profile.profileUrl,
                    emails: profile.emails,
                });
                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

module.exports = passport;