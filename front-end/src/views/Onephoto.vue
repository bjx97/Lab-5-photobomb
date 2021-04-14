<template>
    <div class="info">
        <div class="basic">
            <img :src="photo.path" />
            <p><strong>Title: </strong>{{photo.title}}</p>
            <p><strong>Name: </strong> {{photo.user.firstName}} {{photo.user.lastName}}</p>
            <p><strong>Description: </strong>{{photo.description}}</p>
            <p><strong>Date: </strong>{{photo.created}}</p>
        </div>
        <div class="form">
            <h3>Comment: </h3>
            <form v-on:submit.prevent="addComment()">
                <textarea rows="4" cols="50"  v-model="eDescription" placeholder="Description"></textarea><br/><br/>
                <button type="submit">Comment</button>
            </form>
            <h3>List of Comments:</h3>
            <br/>
            <div v-for="comment in comments" v-bind:key="comment._id">
                <p>{{comment.comment}}</p>
                <p>--<i>{{comment.user}}</i></p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Singlepic',
  data() {
    return {
        photo: {
            user: {firstName: '', lastName: ''},
            description: '',
            create: ''
        },
        error: '',
        eDescription: '',
        comments: [],
    }
  },
  created() {
    this.getPhoto();
    this.getComments(); 
  },
  methods: {
    async getPhoto() {
      try {
        let response = await axios.get("/api/photos/" + this.$route.params.id);
        this.photo = response.data;
      } catch (error) {
        this.error = error.response.data.message;
      }
    },
    async getComments() {
      try {
        let response = await axios.get("/api/comments/" + this.$route.params.id );
        this.comments = response.data;
        this.allcom = [];
        let getcomments = await axios.get("/api/comments/" + this.$route.params.id );
        this.allcom = getcomments.data;
        console.log(getcomments);
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async addComment() {
      try {
        await axios.post("/api/comments/" + this.$route.params.id , {
            comment: this.eDescription
        });
        this.eDescription = "";
        this.getComments();
        return true;
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>

<style scoped>
    img {
    margin-top: 150px;
    padding: 5px;
    width: 500px;
    }
    
    .info {
        display: flex;
        justify-content: space-around;
    }

    .form{
        margin-left: 100px;
        margin-top: 150px;
    }
</style>