# Authentication Performance Benchmark

Environment

- Node.js
- MongoDB Local
- bcrypt rounds: 12

Register

Average

Find Existing User : 3.76 ms

Create User : 504.58 ms

Generate JWT : 2.24 ms

Login

Average

Find User : 3.88 ms

Compare Password : 561.45 ms

Generate JWT : 1.97 ms

Conclusion

Authentication latency is dominated by bcrypt hashing.

Database and JWT generation are within acceptable limits.
