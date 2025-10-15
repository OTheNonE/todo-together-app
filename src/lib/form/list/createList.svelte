<script lang="ts">
    import { createList } from "$lib/rpc/list";

    const { name } = createList.fields

</script>

<form {...createList}>
    <input {...name.as("text")}>
    <button type="submit"> Create </button>
</form>