import asyncio
from database_module import MC_Connection


async def main():
    db_conn = MC_Connection()
    task = asyncio.create_task(db_conn.plug_in())
    done, pending = await asyncio.wait({task})
    if task in done:
        truncate_query = "TRUNCATE TABLE articles;"
        db_object = db_conn.get_db_obj()
        await db_object.execute(query=truncate_query)


if __name__ == "__main__":
    asyncio.run(main())
