<template>
    <div class="notebook">
        <ul>
            <li>
                DRUPAL PROJECTS LIST
            </li>
            <li v-for="(page, index) of pages"
                class="page"
                v-bind:class="{ 'active': index === activePage }"
                @click="changePage(index)">
                <div>{{page.title}}</div>
            </li>
            <div class="new-page" @click="newPage()">+</div>
        </ul>
    </div>
</template>

<script>
  export default {
    name: 'landing-page',
    props: ['pages', 'activePage'],
    methods: {
      changePage (index) {
        this.$emit('change-page', index)
      },
      newPage () {
        this.$emit('new-page')
      }
    }
  }
</script>

<style lang="scss" scoped>
    @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

    body {
        font-family: 'Source Sans Pro', sans-serif;
    }

    .notebook {
        max-width: 18rem;
        width: 30rem;
        background-color: #1F292E;
    }

    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
        height: 100%;
        position: relative;
    }

    li {
        transition-duration: 0.5s;
        padding-top: 30px;
        text-align: center;
        padding: 0.5rem;
        font-weight: 600;
        font-size: 1rem;
        min-height: 1.5rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #415058;
        border-bottom: 1px solid #415058;
        &:first-child{
            top: 10px;
            left: 10px;
            font-size: 0.65rem;
            color: #F2F2F3;
        }
        &:not(:first-child):hover{
            cursor: pointer;
            background-color: #c8cdd0;
        }

        &.active{
            color: white;
            background-color: #2962ff;
            transition-delay: 0s;
        }
    }


    .new-page {
        padding: 1rem;
        font-size: 1.25rem;
        min-height: 1.5rem;
        white-space: nowrap;
        overflow: hidden;
        width: 30px;
        height: 30px;
        border-radius: 100%;
        border: 2px solid rgba(255,255,255,0.4);
        outline: none;
        color: #FFF;
        font-size: 45px;
        transition: .3s;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        bottom: 30px;
        margin-right: auto;
        margin-left: auto;
        left: 0px;
        right: 0px;
    }

    .new-page:hover {
        background-color: #2962ff;
        border-color: #2962ff;
        transform: rotate(90deg);
    }
</style>
