1 text-xs"><Clock className="h-3 w-3" />{new Date(event.start_datetime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-900 dark:text-white">{event.organizer?.name || 'N/A'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/calendar/${event.id}/edit`}><Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button></Link>
                                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => setEventToDelete(event)}><Trash2 className="h-4 w-4" /></Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {events.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-neutral-200 px-6 py-4 dark:border-neutral-800">
                            <div className="flex gap-2">
                                {events.links.map((link, index) => {
                                    if (link.url === null) return null;
                                    return <Link key={index} href={link.url} className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${link.active ? 'bg-neutral-900 text-white dark:bg-white dark:text-black' : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'}`} dangerouslySetInnerHTML={{ __html: link.label }} />;
                                })}
                            </div>
                        </div>
                    )}
                </div>
                {events.data.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-white/50 p-12 dark:border-neutral-700 dark:bg-neutral-900/50">
                        <Calendar className="h-12 w-12 text-neutral-400" />
                        <h3 className="mt-4 text-lg font-medium text-neutral-900 dark:text-white">No events found</h3>
                        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Try adjusting your filters or add a new event</p>
                    </div>
                )}
                <AlertDialog open={!!eventToDelete} onOpenChange={() => setEventToDelete(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>This action cannot be undone. This will permanently delete this event.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-600 dark:hover:bg-red-700">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </AppLayout>
    );
}
