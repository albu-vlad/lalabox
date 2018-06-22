<template>
    <div class="notebook">
        <ul>
            <li>
                Drupal Projects List
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
        border-right: 1px solid lightgray;
    }

    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
        height: 100%;
        position: relative;
    }

    li {
        background-color: rgb(245, 245, 245);
        transition-duration: 0.5s;

        padding-top: 30px;
        text-align: center;

        padding: 0.5rem;
        font-size: 1rem;
        min-height: 1.5rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 2px;
        color: darkgrey;

        &:hover{
            cursor: pointer;
            background-color: rgb(225, 225, 225);
        }

        &.last{
            border-bottom: none;
        }

        &.active{
            border-bottom: none;
            color: white;
            background-color: #46bef5;

            transition-delay: 0.5s;
            transform: scale(1.1, 1.1);

            -webkit-transition-delay: 0.5s;
            -webkit-transform: scale(1.05, 1.2);
        }
    }

    .new-page {
        padding: 1rem;
        font-size: 1.25rem;
        min-height: 1.5rem;
        white-space: nowrap;
        overflow: hidden;
        background-color: #46bef5;
        width: 30px;
        height: 30px;
        border-radius: 100%;
        background: #46bef5;
        border: none;
        outline: none;
        color: #FFF;
        font-size: 45px;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
        transition: .3s;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
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
        background-color: #32a0f5;
    }
</style>
