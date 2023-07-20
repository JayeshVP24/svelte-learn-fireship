<script lang="ts">
  import AuthCheck from "$lib/components/AuthCheck.svelte";
  import { userData, storage, user, db } from "$lib/firebase";
  import { doc, updateDoc } from "firebase/firestore";
  import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
  let previewURL: string;
  let uploading = false;

  async function upload(
    e: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    }
  ) {
    uploading = true;
    if (e.currentTarget.files) {
      const file: Blob | undefined = e?.currentTarget?.files[0] ?? undefined;
      if (file) {
        previewURL = URL.createObjectURL(file);
        const storageRef = ref(storage, `users/${$user!.uid}/profile.png`);
        const result = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(result.ref);

        await updateDoc(doc(db, "users", $user!.uid), { photoURL: url });
        uploading = false;
      }
    }
  }
</script>

<AuthCheck>
  <h2 class="card-tite">Upload a Profile Photo</h2>

  <form class="max-w-screen w-full">
    <div class="form-control w-full max-w-xs my-10 mx-auto text-center">
      <img
        src={previewURL ?? $userData?.photoURL ?? "/user.jpg"}
        alt="photoURL"
        width="256"
        height="256"
        class="mx-auto"
      />

      <span class="my-5" >
        <label for="photoURL" class="label">
          <span class="label-text">Pick a file</span>
        </label>

        <input
          type="file"
          name="photoURL"
          on:change={upload}
          class="file-input file-input-bordered w-full max-w-xs"
          accept="image/png, image/jpeg, image/gif, image/webp"
        />
      </span>
      {#if uploading}
        <span class="mx-auto my-5">
          <p>Uploading...</p>
          <progress class="progress progress-info w-56 mt-6" />
        </span>
      {/if}
    </div>
  </form>
</AuthCheck>
