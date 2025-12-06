import { useEffect, useState } from "react";
import { apiGetMe, apiGetMyBots } from "../api";

export default function BotsList() {
    const [me, setMe] = useState(null);
    const [bots, setBots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function load() {
            try {
                const profile = await apiGetMe();
                setMe(profile.user);

                const botsData = await apiGetMyBots();
                setBots(botsData.items || []);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    if (loading) return <div className="p-4">Загрузка...</div>;
    if (error) return <div className="p-4 text-red-400">{error}</div>;

    return (
        <div className="p-4 flex flex-col gap-4">

            {/* ←←← ВОТ СЮДА ВСТАВЛЯЕШЬ ВЕРХНИЙ БЛОК */}
            {me && (
                <div className="rounded-2xl bg-slate-900/80 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Аватар */}
                        <div className="w-14 h-14 rounded-xl bg-slate-700" />

                        <div>
                            <div className="text-white font-semibold">
                                {me.firstName} {me.lastName}
                            </div>
                            <div className="text-sm text-slate-400">@{me.username}</div>
                        </div>
                    </div>

                    <button className="p-2 rounded-full bg-red-600 text-white">✕</button>
                </div>
            )}
            {/* →→→ КОНЕЦ ВСТАВКИ */}

            {/* Блок "Перейдите в бота и пополните баланс" */}
            {!me?.hasAccess && (
                <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 text-center">
                    <div className="text-white font-semibold text-lg mb-2">
                        Перейдите в бота и пополните баланс
                    </div>
                    <div className="text-sm text-slate-400">
                        После пополнения купите подписку, чтобы получить доступ к созданию ботов 🚀
                    </div>
                </div>
            )}

            {/* Если доступ есть → показываем список ботов */}
            {me?.hasAccess && bots.map(bot => (
                <div key={bot._id} className="bg-slate-900/80 p-4 rounded-2xl">
                    @{bot.username}
                </div>
            ))}
        </div>
    );
}