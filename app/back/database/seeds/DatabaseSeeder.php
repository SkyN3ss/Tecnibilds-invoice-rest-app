<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call(UserTableSeeder::class);
        $this->call(EmployeeTableSeeder::class);
        $this->call(CustomerTableSeeder::class);
        $this->call(ProviderTableSeeder::class);
        $this->call(ProductTableSeeder::class);
        $this->call(InvoiceTableSeeder::class);
        $this->call(ChatMessageTableSeeder::class);

        /* POSTS, COMMENTS, LIKES */
        $this->call(PostTableSeeder::class);
        $this->call(Post_CommentsTableSeeder::class);
        $this->call(LikeTableSeeder::class);
    }
}
