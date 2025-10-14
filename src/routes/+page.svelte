<script>
    import { CreateUserForm, DeleteUserForm } from "$lib/form/user";
    import { getUsers } from "$lib/rpc/user";

</script>

<h1> Hello </h1>
<a href="/login/google"> Login with Google </a>

<!-- <CreateUserForm /> -->

<!-- <table>
    <caption> Some users </caption>
    <thead>
        <tr>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Email</th>
            <th scope="col"></th>
        </tr>
    </thead>
    <tbody>
        {#each await getUsers() as { first_name, last_name, email, id }}
            <tr>
                <th>{first_name}</th>
                <td>{last_name}</td>
                <td>{email}</td>
                <td> <DeleteUserForm {id}/> </td>
            </tr>
        {/each}
    </tbody>
</table> -->
