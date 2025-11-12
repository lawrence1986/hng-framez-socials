// Utility to test Supabase Storage connection and upload
import { supabase } from "@config/supabase";


export const testStorageConnection = async () => {
  try {
    console.log("Testing Supabase Storage connection...");
    console.log("Using Supabase URL:", supabase.supabaseUrl);

    // Step 1: List buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

    if (bucketsError) {
      console.error("❌ Error listing buckets:", bucketsError);
      return {
        success: false,
        error: `Cannot access storage: ${bucketsError.message}`,
        step: "listBuckets",
      };
    }

    console.log("✅ Buckets found:", buckets.map((b) => b.name || b.id));

    // Step 2: Check if posts bucket exists (case-insensitive check)
    const postsBucket = buckets.find(
      (bucket) => bucket.id?.toLowerCase() === "posts"
    );

    if (!postsBucket) {
      return {
        success: false,
        error:
          'Storage bucket "posts" not found. Please check its exact name or create it in Supabase Dashboard → Storage.',
        step: "bucketExists",
        buckets: buckets.map((b) => b.id || b.name),
      };
    }

    console.log("✅ Posts bucket found:", postsBucket);

    // Step 3: Check public/private
    console.log(
      postsBucket.public
        ? "✅ Bucket is public"
        : "⚠️ Bucket is private (requires auth policies)"
    );

    // Step 4: Test auth
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user) {
      return {
        success: false,
        error: "Not authenticated. Please log in first.",
        step: "authentication",
      };
    }

    console.log("✅ Authenticated as:", authData.user.id);

    // Step 5: List files (test read access)
    const { data: files, error: listError } = await supabase.storage
      .from("posts")
      .list(authData.user.id, { limit: 1 });

    if (listError) {
      console.warn(
        "⚠️ Could not list files (may be empty or no SELECT policy):",
        listError.message
      );
    } else {
      console.log("✅ Read access works. Files:", files);
    }

    return {
      success: true,
      message: "✅ Storage connection successful!",
      bucket: postsBucket.id,
      user: authData.user.id,
    };
  } catch (error: any) {
    console.error("❌ Storage connection test error:", error);
    return {
      success: false,
      error: `Connection test failed: ${error.message}`,
      step: "connection",
    };
  }
};

// Simple upload test
export const testStorageUpload = async () => {
  try {
    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user;
    if (!user) throw new Error("Not authenticated");

    const testPath = `${user.id}/test-${Date.now()}.txt`;
    const testBlob = new Blob(["test file"], { type: "text/plain" });

    console.log("🧪 Uploading test file:", testPath);

    const { data, error } = await supabase.storage
      .from("posts")
      .upload(testPath, testBlob, { contentType: "text/plain" });

    if (error) {
      console.error("❌ Upload test error:", error.message);
      return { success: false, error: error.message };
    }

    console.log("✅ Upload succeeded:", data);

    await supabase.storage.from("posts").remove([testPath]);

    return { success: true, message: "✅ Upload test successful!" };
  } catch (error: any) {
    console.error("❌ Upload test exception:", error.message);
    return { success: false, error: error.message };
  }
};
