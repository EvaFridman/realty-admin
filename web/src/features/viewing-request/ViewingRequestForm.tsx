import { Button, Input } from "@/shared/ui";

import styles from "./ViewingRequestForm.module.css";

{/* TODO: переделать, когда появится функционал валидации и отправки*/}
export function ViewingRequestForm() {
    return (<form className={styles.form}> <div className={styles.fields}> <label>
        Имя <Input name="name" type="text" placeholder="Ваше имя" /> </label>

        <label>
            Телефон
            <Input name="phone" type="tel" placeholder="+7 (___) ___-__-__" />
        </label>

        <label>
            Email
            <Input name="email" type="email" placeholder="example@mail.ru" />
        </label>

        <label>
            Дата
            <Input name="date" type="date" />
        </label>

        <label>
            Время
            <Input name="time" type="time" />
        </label>

        <label className={styles.comment}>
            Комментарий
            <textarea
                name="comment"
                placeholder="Дополнительная информация"
                rows={4}
            />
        </label>
    </div>

        <Button type="button" variant="primary" size="md">
            Отправить заявку
        </Button>
    </form>
    );
}