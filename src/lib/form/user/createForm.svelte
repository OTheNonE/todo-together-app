<!-- <script lang="ts">
    // import { createUser } from "$lib/rpc/user";

    type EnhanceInstructions = Parameters<typeof createUser.enhance>[0]

    const { email, first_name, last_name } = createUser.fields

    const fn: EnhanceInstructions = ({ data, form, submit }) => {
        submit()
        form.reset()
    }

</script>

<h1> Create a user </h1>

<form 
    {...createUser}
>
    <label>
        First Name: 
        <input {...first_name.as("text")}>
    </label>

    <br>

    <label>
        Last Name: 
        <input {...last_name.as("text")}>
    </label>

    <br>

    <label>
        Email: 
        <input {...email.as("email")}>
    </label>

    <br>

    <button type="submit">
        Submit
    </button>

</form> -->