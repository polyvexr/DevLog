import axios from "axios";

export const fetchLeetCode = async (username) => {
  try {
    const res = await axios.post("https://leetcode.com/graphql", {
      query: `
        query userProfile($username: String!) {
          matchedUser(username: $username) {
            submitStats {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
        }
      `,
      variables: { username },
    });

    return res.data.data.matchedUser.submitStats;
  } catch (err) {
    console.log("LC Fetch Error:", err.message);
    return {};
  }
};
