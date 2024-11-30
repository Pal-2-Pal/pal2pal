// /pages/api/supabaseHelper.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);
supabase.auth.signIn({provider:'google'})
// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { email, password } = req.body;

//     try {
//       const { error } = await supabase.auth.signUp({ email, password });
//       if (error) throw error;
//       return res.status(200).json({ message: 'Sign-up successful! Check your email to confirm.' });
//     } catch (error) {
//       return res.status(400).json({ error: error.message });
//     }
//   } else {
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }

