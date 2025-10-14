<script lang="ts">
    import { deleteUser } from "$lib/rpc/user";

    type Props = { id: number }

    const { id }: Props = $props()

    const deleteSpecificUser = deleteUser.for(id)

    const { fields } = deleteSpecificUser

</script>

<form {...deleteSpecificUser}>
    <input {...fields.id.as("number")} hidden value={id}>
    <button type="submit"> Remove </button>
</form>