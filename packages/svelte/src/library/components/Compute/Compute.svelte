<script lang="ts">
  import type { EditorState } from 'core/index';
  import RawNode from '../Node/RawNode.svelte';
  import { writable, type Writable } from 'svelte/store';
  import type { FJ } from '@/library';
  import { Editor } from '../Editor';

  export let nodes: Record<string, FJ.NodeBlueprint>;
  export let state: EditorState;

  export let inputs: Record<string, { type: string; value: Writable<unknown> }> = {};
  export let outputs: Record<string, { type: string; value: Writable<unknown> }> = {};

  export let instance = new Editor({
    blueprint: writable(nodes),
    state,
    readonly: true,
    inputs,
    outputs,
  });

  const { current: currentNodes } = instance.nodes;
  const { nodes: nodesState } = instance.state;
</script>

<div class="function-junctions-compute">
  {#each Object.keys($currentNodes) as key}
    {#if $currentNodes[key] && $nodesState[key]}
      <RawNode
        title={$currentNodes[key].type}
        id={key}
        component={$currentNodes[key].component}
        inputs={$currentNodes[key].inputs}
        outputs={$currentNodes[key].outputs}
        editor={instance}
        bind:store={$nodesState[key].store}
      />
    {/if}
  {/each}
</div>
