<script lang="ts">
    import { CreateList } from "$lib/form/list";


    let createNewListModal: HTMLDialogElement | undefined;

</script>

<button class="btn" onclick={() => createNewListModal?.showModal()}> New List </button>

<dialog bind:this={createNewListModal} class="modal">
    <div class="modal-box">
        <h3> Hello! </h3>
        <p> Press ESC </p>
        <div class="modal-action">
            <CreateList/>
            <form method="dialog">
                <button class="btn"> Close </button>
            </form>
        </div>
    </div>
</dialog>